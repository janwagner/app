import React, { FunctionComponent } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useStore from 'lib/store'
import { classNamesLib } from 'components/ClassNames/ClassNames'
import BaseDialog from 'components/Dialog/BaseDialog'
import { createSpace, getSpaceByName } from 'api/spaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const CreateSpaceDialog: FunctionComponent = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const {
    contract,
    isOpenCreateSpaceDialog,
    setIsOpenCreateSpaceDialog,
    spaces,
    setSpaces,
  } = useStore((state) => ({
    contract: state.contract,
    isOpenCreateSpaceDialog: state.isOpenCreateSpaceDialog,
    setIsOpenCreateSpaceDialog: state.setIsOpenCreateSpaceDialog,
    spaces: state.spaces,
    setSpaces: state.setSpaces,
  }))

  // HANDLE FORM SUBMIT
  type FormValues = {
    name: string
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true)
    const result = await createSpace(contract, data.name)
    if (result.success) {
      const newSpace = await getSpaceByName(contract, data.name)
      spaces.push(newSpace)
      setSpaces(spaces)
      setIsLoading(false)
      setIsOpenCreateSpaceDialog(false)
    } else {
      // console.log(result)
      setIsLoading(false)
    }
  }

  const handleClose = (): void => {
    setIsOpenCreateSpaceDialog(false)
  }

  return (
    <BaseDialog
      showDialog={isOpenCreateSpaceDialog}
      onClose={handleClose}
      header='Create Space'
      body={
        <form id='createSpaceForm' onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-3 gap-x-4 gap-y-8'>
            <div className='col-span-3'>
              <span
                className={`
                  ${classNamesLib.dialogLabel}
                  ${classNamesLib.dialogLabelDark}
                `}
              >
                Create Space
              </span>
              <div className={classNamesLib.inputWrapper}>
                <input
                  className={`
                    ${classNamesLib.input}
                    ${classNamesLib.inputDark}
                  `}
                  type='text'
                  {...register('name', { required: true })}
                />
                {errors.name && (
                  <div
                    className={`${classNamesLib.formValidation} ${classNamesLib.formValidationError}`}
                  >
                    <span
                      className={`${classNamesLib.formValidationText} ${classNamesLib.formValidationTextError}`}
                    >
                      Required Field
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      }
      footer={
        <>
          <button
            type='button'
            className={`
              ${classNamesLib.button}
              ${classNamesLib.buttonTransparent}
              ${classNamesLib.buttonTransparentDark}
              basis-full
            `}
            onClick={() => setIsOpenCreateSpaceDialog(false)}
          >
            Cancel
          </button>
          <button
            type='submit'
            form='createSpaceForm'
            className={`${classNamesLib.button} ${classNamesLib.buttonDecensored} basis-full`}
          >
            <span className='whitespace-nowrap'>
              Create{' '}
              {isLoading && (
                <FontAwesomeIcon
                  icon={faSpinner}
                  className='ml-2 animate-spin'
                />
              )}
            </span>
          </button>
        </>
      }
    />
  )
}

export default CreateSpaceDialog